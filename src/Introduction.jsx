import './style.css'
import ButtonMailto from "./Email"
import Socials from './Socials'

export default function Introduction() {
    return (
        <>
            <div className="
                flex flex-col gap-2 
                text-center md:text-center lg:text-left 
                w-full 
                transform 
                md:-translate-y-12
                [&>*]:max-w-full
            ">
                <h1 className="
                    text-3xl 
                    [screen and (min-width:657px) and (max-width:765px)]:text-xl
                    md:text-2xl 
                    lg:text-3xl 
                    font-bold 
                    animate__animated animate__fadeInUp animate__delay-1s
                ">
                    Hi there!
                </h1>
                <h2 className="
                    text-xl 
                    [screen and (min-width:657px) and (max-width:765px)]:text-base
                    md:text-lg 
                    lg:text-xl 
                    animate__animated animate__fadeInUp animate__delay-2s
                ">
                    My name is Abishek Kenneth!
                </h2>
                
                <div className="
                    flex items-center 
                    text-xl 
                    [screen and (min-width:657px) and (max-width:765px)]:text-base
                    md:text-lg 
                    lg:text-xl 
                    whitespace-nowrap 
                    justify-center lg:justify-start 
                    animate__animated animate__fadeInUp animate__delay-3s
                ">
                    <span>I am a</span>
                    <div className="content mx-2">
                        <div className="content__container">
                            <div className="animated-text-wrapper">
                                <ul className="content__container__list [screen and (min-width:657px) and (max-width:765px)]:text-base">
                                    <li className="content__container__list__item">Three.js</li>
                                    <li className="content__container__list__item">Frontend</li>
                                    <li className="content__container__list__item">Fullstack</li>
                                    <li className="content__container__list__item">API</li>
                                    <li className="content__container__list__item">Backend</li>
                                    <li className="content__container__list__item"></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <span>Developer</span>
                </div>
                
                <div className="w-full flex justify-center lg:justify-start">
    <div className="grid grid-cols-[auto_auto_auto] gap-1 items-start w-fit py-5 sm:py-1 animate__animated animate__fadeInUp animate__delay-4s">
        <div className="justify-self-start">
            <ButtonMailto 
                label={
                    <img 
                        className="w-14 h-14 sm:w-10 sm:h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                        src="./email.png"
                        alt="Email"
                    />
                } 
                mailto="abishek.kenneth@gmail.com"
            />
        </div>
        <div className="justify-self-start">
            <a href="https://github.com/abi1035">
                <img 
                    className="w-14 h-14 sm:w-10 sm:h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                    src="./github.svg"
                    alt="GitHub"
                />
            </a>
        </div>
        <div className="justify-self-start ml-2 sm:ml-0 md:ml-6 lg:ml-8">
            <a href="https://www.linkedin.com/in/abishek-kenneth">
                <img 
                    className="w-14 h-14 sm:w-10 sm:h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                    src="./LinkedIn.gif"
                    alt="LinkedIn"
                />
            </a>
        </div>
    </div>
</div>  

            </div>
        </>
    )
}