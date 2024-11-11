import './style.css'

export default function Introduction() {
    return (
        <>
            <div className="flex flex-col gap-2 text-center md:text-center lg:text-left w-full">
                <h1 className="text-3xl font-bold">Hi there!</h1>
                <h2 className="text-xl">My name is Abishek Kenneth!</h2>
                
                <div className="flex items-center text-xl  whitespace-nowrap justify-center lg:justify-start">
                    <span>I am a</span>
                    <div className="content mx-2">
                        <div className="content__container">
                            <div className="animated-text-wrapper">
                                <ul className="content__container__list">
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
            </div>
        </>
    )
}