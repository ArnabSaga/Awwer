import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";
import { useWindowScroll } from "react-use";
import gsap from "gsap";

const navItems = ['Nexus', 'Vault', 'Prologue', 'About', 'Contact'];

const Navbar = () => {
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isIndicatorActive, setIsIndicatorActive] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [showAlert, setShowAlert] = useState(false);

    const navContainerRef = useRef(null);
    const audioElementRef = useRef(null);
    const alertTimeoutRef = useRef(null);

    const { y: currentScrollY } = useWindowScroll();

    useEffect(() => {
        if (currentScrollY === 0) {
            setIsNavVisible(true);
            navContainerRef.current.classList.remove('floating-nav');
        } else if (currentScrollY > lastScrollY) {
            setIsNavVisible(false);
            navContainerRef.current.classList.add('floating-nav');
        } else if (currentScrollY < lastScrollY) {
            setIsNavVisible(true);
            navContainerRef.current.classList.add('floating-nav');
        }

        setLastScrollY(currentScrollY);
    }, [currentScrollY, lastScrollY]);

    useEffect(() => {
        gsap.to(navContainerRef.current, {
            y: isNavVisible ? 0 : -100,
            opacity: isNavVisible ? 1 : 0,
            duration: 0.2
        })
    }, [isNavVisible])

    useEffect(() => {
        alertTimeoutRef.current = setTimeout(() => {
            if (!isAudioPlaying) {
                setShowAlert(true);
            }
        }, 10000);

        return () => {
            if (alertTimeoutRef.current) {
                clearTimeout(alertTimeoutRef.current);
            }
        };
    }, [isAudioPlaying]);

    const toggleAudioIndicator = () => {
        setIsAudioPlaying((prev) => !prev);
        setIsIndicatorActive((prev) => !prev);
        setShowAlert(false);
        
        if (alertTimeoutRef.current) {
            clearTimeout(alertTimeoutRef.current);
        }
    };

    useEffect(() => {
        if (isAudioPlaying) {
            audioElementRef.current.play();
        } else {
            audioElementRef.current.pause();
        }
    }, [isAudioPlaying])

    return (
        <div
            ref={navContainerRef}
            className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
        >
            {showAlert && (
                <div className="absolute -bottom-8 right-0 animate-fade-in rounded-lg bg-black/80 px-4 py-2 text-white">
                    <p className="text-sm">Click to enable sound 🔊</p>
                </div>
            )}
            
            <header className="absolute top-1/2 w-full -translate-y-1/2">
                <nav className="flex size-full items-center justify-between p-4">
                    <div className="flex items-center gap-7">
                        <img
                            src="/img/logo-1.png"
                            alt="logo"
                            className="w-14"
                        />

                        <Button
                            id="product-button"
                            title="Description"
                            rightIcon={<TiLocationArrow />}
                            containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
                        />
                    </div>

                    <div className="flex h-full items-center">
                        <div className="hidden md:block">
                            {
                                navItems.map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        className="nav-hover-btn">
                                        {item}
                                    </a>
                                ))
                            }
                        </div>
                        

                        <button className="ml-10 flex items-center space-x-0.5" onClick={toggleAudioIndicator}>
                            <audio
                                ref={audioElementRef}
                                className="hidden"
                                src="/audio/loop-1.mp3"
                                loop
                            />

                            {[1, 2, 3, 4].map((bar) => (
                                <div
                                    key={bar}
                                    className={`indicator-line ${isIndicatorActive ? 'active' : ''}`}
                                    style={{ animationDelay: `${bar * 0.1}s` }}
                                />
                            ))}
                            

                        </button>
                    </div>
                </nav>
            </header>
        </div>
    )
}

export default Navbar