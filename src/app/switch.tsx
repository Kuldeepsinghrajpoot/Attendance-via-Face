'use client'
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

export function SwitchDemo() {
    const { theme, setTheme } = useTheme();

    const handleThemeChange = () => {

        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className={`flex justify-between items-center  ${theme==='light'?"dark:text-black":"  dark:text-white"}`}>
            {/* <Login /> */}
            <div className="flex items-center space-x-2">
                <Switch id="theme-switch" onCheckedChange={() => handleThemeChange()} onChange={handleThemeChange} />
                <Label className={`${theme==='light'?"text-black":"bg-background"}`} htmlFor="theme-switch">{theme === 'light' ? 'Dark' : 'Light'}</Label>
            </div>
        </div>
    );
}