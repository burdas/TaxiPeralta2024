import React from 'react';
import { Button } from "@/components/ui/button"

const FooterLogout = () => {
    return (
        <footer className="d-flex justify-items-end py-6">
            <form action="/api/logout" method="post" className="w-fit">
                <Button type="submit" variant="destructive" size="lg">Cerrar sesión</Button>
            </form>
        </footer>
    );
};

export default FooterLogout;