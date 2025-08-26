import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { format } from 'date-fns';
import EventModal from './EventModal';
import TagDisplay from './TagDisplay';
import { usePage } from '@inertiajs/react';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

const TiltedEventCard = ({ event: initialEvent, onEventUpdate }) => {
  const ref = useRef(null);
  const { auth } = usePage().props;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const [event, setEvent] = useState(initialEvent);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update local event state when prop changes
  useEffect(() => {
    setEvent(initialEvent);
  }, [initialEvent]);

  // Allow external trigger to open modal with provided event
  useEffect(() => {
    const handler = (e) => {
      if (!e?.detail) return;
      setEvent(e.detail);
      setIsModalOpen(true);
    };
    window.addEventListener('open-event-modal', handler);
    return () => window.removeEventListener('open-event-modal', handler);
  }, []);

  const handleEventUpdate = (updatedEvent) => {
    setEvent(updatedEvent);
    if (onEventUpdate) {
      onEventUpdate(updatedEvent);
    }
  };

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -12;
    const rotationY = (offsetX / (rect.width / 2)) * 12;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  function handleMouseEnter() {
    scale.set(1.05);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer"
      >
        <figure
          ref={ref}
          className="relative w-[300px] h-[200px] [perspective:800px] flex items-center justify-center z-10"
          onMouseMove={handleMouse}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="relative w-full h-full [transform-style:preserve-3d]"
            style={{
              rotateX,
              rotateY,
              scale,
            }}
          >
            {/* Card Image */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full rounded-md overflow-hidden"
            >
              <img
                src={event.cover_image ? `/${event.cover_image}` : '/default-event-image.jpg'}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              {/* Subtle dark gradient to improve image contrast without fighting light theme */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>

            {/* Event Information Overlay */}
            <motion.div
              className="absolute bottom-0 left-0 w-full p-2"
              style={{ transform: "translateZ(30px)" }}
            >
              <div className="bg-white/95 border border-orange-100 rounded-lg shadow-sm mx-2 mb-2 p-3 text-gray-900 h-32 flex flex-col justify-between overflow-hidden">
                <div className="flex-1 flex flex-col justify-start space-y-1">
                  {/* Status Badge */}
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] text-white ${
                    event.status === 'Upcoming' ? 'bg-green-500' :
                    event.status === 'Ongoing' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`}>
                    {event.status}
                  </span>

                  {/* Title */}
                  <h3 className="text-sm font-bold leading-tight text-gray-900 line-clamp-2">{event.title}</h3>

                  {/* Date & Time */}
                  <div className="flex items-center text-[10px] text-gray-600">
                    <span className="material-symbols-outlined text-xs mr-1">calendar_today</span>
                    <span>
                      {format(new Date(event.date), 'MMM dd, yyyy')} • {event.formatted_time}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-[10px] text-gray-600">
                    <span className="material-symbols-outlined text-xs mr-1">location_on</span>
                    <span className="truncate">{event.location}</span>
                  </div>

                  {/* Participants - Only for internal events */}
                  {!event.is_external && (
                    <div className="flex items-center text-[10px] text-gray-600">
                      <span className="material-symbols-outlined text-xs mr-1">
                        {event.is_team_event ? 'groups' : 'group'}
                      </span>
                      <span>
                        {event.is_team_event 
                          ? `${event.enrolled_teams_count || 0}/${event.max_participants} teams` 
                          : `${event.enrolled_count}/${event.max_participants} participants`}
                      </span>
                    </div>
                  )}
                </div>


              </div>
            </motion.div>


          </motion.div>
        </figure>
      </div>

      <EventModal
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventUpdate={handleEventUpdate}
        auth={auth}
      />
    </>
  );
};

export default TiltedEventCard; 