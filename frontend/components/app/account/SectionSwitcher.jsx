import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";


export default function SectionSwitcher({ accountType }) {
    const router = useRouter();
    const pathname = usePathname();
    const [section, setSection] = useState(pathname.split("/").pop());
    
    const handleSectionChange = (key) => {
        const stringKey = String(key);
        setSection(stringKey);
        setTimeout(() => {
            router.push(`/${stringKey}`);
        }, 175);
    };
    
    return (
        <Tabs
            variant="light"
            color="white"
            radius="full"
            className="py-2"
            classNames={{
                tabContent: "text-black",
                tab: "data-[selected=true]:font-bold"
            }}
            selectedKey={section}
            onSelectionChange={handleSectionChange}
        >
            {accountType === "user" && (
                <>
                    <Tab key="account" title="Account Info" />
                    <Tab key="orders" title="Order History" />
                </>
            )}
            {accountType === "restaurant" && (
                <>
                    <Tab key="orders" title={<><span className="sm:hidden">Orders</span><span className="hidden sm:inline">Manage Orders</span></>} />
                    <Tab key="account" title={<><span className="sm:hidden">Account</span><span className="hidden sm:inline">Account Info</span></>} />
                    <Tab key="dishes" title={<><span className="sm:hidden">Dishes</span><span className="hidden sm:inline">Manage Dishes</span></>} />
                </>
            )}
        </Tabs>
    );
}