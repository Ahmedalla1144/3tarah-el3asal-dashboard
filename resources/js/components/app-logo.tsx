import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <AppLogoIcon className="size-14" />
            <div className="grid leading-tight">
                <span className="font-bold text-yellow-700 dark:text-yellow-400 text-lg">
                    العسال
                </span>
                <span className="text-xs text-neutral-600 dark:text-neutral-400">
                    عطارة
                </span>
            </div>
        </div>
    );
}
