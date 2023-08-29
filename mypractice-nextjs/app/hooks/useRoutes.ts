import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {HiChat} from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUser } from 'react-icons/hi2';
import {signOut } from "next-auth/react";

import useConversation from "./useConversation";

const useRoutes = () => {
    const pathname = usePathname();
    const { conversionId }  = useConversation();

    const routes = useMemo(() => [
        {
            label : 'Chat',
            href: '/conversations',
            icon: HiChat,
            active : pathname === '/conversations' || !!conversionId
        },
        {
            label : 'Users',
            href: '/users',
            icon: HiUser,
            active : pathname === '/users'
        },
        {
            label : 'Logout',
            href: '#',
            onClick: () => signOut(),
            icon: HiArrowLeftOnRectangle
        }
    ],[pathname, conversionId])

    return routes;
}

export default useRoutes