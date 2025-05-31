import { Loader2 } from "lucide-react";
import { FC } from "react";

type LoaderProps = {
    width: number;
    height: number;
}

const Loader: FC<LoaderProps> = ({
    height,
    width
}) => {
    return <Loader2
        className={`w-${width} h-${height} animate-spin`}
    />
}

export default Loader