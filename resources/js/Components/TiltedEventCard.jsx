import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { format } from 'date-fns';
import EventModal from './EventModal';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

const TiltedEventCard = ({ event: initialEvent, onEventUpdate }) => {
  const ref = useRef(null);
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
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </motion.div>

            {/* Event Information Overlay */}
            <motion.div
              className="absolute bottom-0 left-0 w-full p-2.5 text-white [transform:translateZ(30px)]"
            >
              <div className="space-y-0.5">
                {/* Status Badge */}
                <span className={`inline-block px-1.5 py-0.5 rounded-full text-[10px] ${
                  event.status === 'Upcoming' ? 'bg-green-500' :
                  event.status === 'Ongoing' ? 'bg-blue-500' :
                  'bg-gray-500'
                }`}>
                  {event.status}
                </span>

                {/* Title */}
                <h3 className="text-base font-bold leading-tight truncate">{event.title}</h3>

                {/* Date & Time */}
                <div className="flex items-center text-[10px]">
                  <span className="material-symbols-outlined text-xs mr-1">calendar_today</span>
                  <span>
                    {format(new Date(event.date), 'MMM dd, yyyy')} • {event.formatted_time}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center text-[10px]">
                  <span className="material-symbols-outlined text-xs mr-1">location_on</span>
                  <span className="truncate">{event.location}</span>
                </div>

                {/* Participants */}
                <div className="flex items-center text-[10px]">
                  <span className="material-symbols-outlined text-xs mr-1">group</span>
                  <span>{event.enrolled_count}/{event.max_participants} participants</span>
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
      />
    </>
  );
};

export default TiltedEventCard; 