import { Head, Link } from '@inertiajs/react';
import SplashCursor from '@/Components/SplashCursor';
import InfiniteMenu from '@/Components/InfiniteMenu';

const items = [
    {
      image: '/images/Catalyst.png',
      title: 'Catalyst',
      description: 'You are right here!'
    },
    {
      image: '/images/UTM-LOGO.png',
      link: 'https://www.utm.my/',
      title: 'University of Technology Malaysia',
      description: 'Visit the school website :)'
    },
    {
      image: '/images/nexscholar.png',
      link: 'https://www.nexscholar.com/',
      title: 'Nexscholar',
      description: 'Visit the main website :)'
    },
    {
      image: 'https://picsum.photos/600/600?grayscale',
      link: 'https://google.com/',
      title: '-',
      description: 'This is pretty cool, right?'
    }
  ];

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="h-screen w-screen relative bg-black">
                <SplashCursor />
                <header className="absolute top-0 left-0 right-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <nav className="flex justify-end space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 border border-white/10 hover:border-white/20"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 border border-white/10 hover:border-white/20"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-200"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>
                <div className="h-full w-full">
                    <InfiniteMenu items={items}/>
                </div>
            </div>
        </>
    );
}
