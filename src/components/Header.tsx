import { Clapperboard, MoreHorizontal } from 'lucide-react';

interface HeaderProps {
    onLogoClick?: () => void;
}

export default function Header({ onLogoClick }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
                <button
                    onClick={onLogoClick}
                    className="flex items-center gap-2 text-left"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white">
                        <Clapperboard size={16} strokeWidth={2.5} />
                    </span>
                    <span className="text-[15px] font-bold tracking-tight text-ink">
                        MBN Global Shorts Finder
                    </span>
                </button>

                <button className="flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-ink">
                    <MoreHorizontal size={20} />
                </button>
            </div>
        </header>
    );
}
