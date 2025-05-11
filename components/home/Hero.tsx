import { FC } from "react";
import Navigation from "./Navigation";

const Hero: FC = () => {
    return (
        <div className="min-h-screen bg-stone-200 darK:bg-background">
            <Navigation />
        </div>
    )
}

export default Hero;