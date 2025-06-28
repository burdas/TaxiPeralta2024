import {Button} from "@/components/ui/button.tsx";
import {type Dispatch, type FC, type SetStateAction, type SVGProps, useRef} from "react";
import Logout from "@/components/Icons/svg/logout.svg?react";
import {ConfirmDialog} from "@/components/AdminReact/Shared/ConfirmDialog.tsx";

type Section = {
    text: string;
    icon: FC<SVGProps<SVGSVGElement>>;
};

interface Props {
    sections: Section[];
    changeSection: Dispatch<SetStateAction<string>>;
    activeSection: string;
}

export default function Sidebar({ sections, changeSection, activeSection }: Props) {
    const logoutForm = useRef<HTMLFormElement>(null);

    const handleSubmit = () => {
        logoutForm.current?.requestSubmit();
    }

    return (
        <>
            <div
                className="hidden p-4 mx-6 mt-2 md:rounded-xl bg-sidebar sticky top-[100px] self-start lg:flex flex-col justify-between h-[calc(100dvh-120px)]">
                <div className="flex flex-col items-center justify-items-center gap-2">
                    {sections.map((section) => (
                        <Button key={section.text} variant={activeSection === section.text ? "default" : "ghost"}
                                className="w-full !justify-start !px-4"
                                onClick={() => changeSection(section.text)}>
                            <section.icon/>
                            {section.text}
                        </Button>
                    ))}
                </div>
                <form action="/api/logout" method="post" className="w-full" ref={logoutForm}>
                    <ConfirmDialog title="¿Deseas cerar la sesión?" onAccept={handleSubmit}>
                        <Button role="button" variant="secondary" size="lg" className="w-full !justify-start !px-4">
                            <Logout />
                            Cerrar sesión
                        </Button>
                    </ConfirmDialog>
                </form>
            </div>
            <div
                className="lg:hidden z-50 px-2 py-3 fixed bottom-0 bg-sidebar self-start justify-center gap-2
                    flex w-full overflow-scroll scrollbar-hide border-t-1">
                {sections.map((section) => (
                    <Button key={section.text} variant={activeSection === section.text ? "default" : "ghost"}
                            size="lg"
                            onClick={() => changeSection(section.text)}
                    className="size-12">
                        <section.icon className="size-6" />
                    </Button>
                ))}
                <form action="/api/logout" method="POST" ref={logoutForm}>
                    <ConfirmDialog title="¿Deseas cerar la sesión?" onAccept={handleSubmit}>
                        <Button role="button" variant="ghost" size="lg" className="size-12">
                            <Logout className="size-6" />
                        </Button>
                    </ConfirmDialog>
                </form>
            </div>
        </>
    )
}