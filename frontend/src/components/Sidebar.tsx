import { Brain, Twitter, Youtube } from "lucide-react";

// Define types for the filter
export type ContentFilter = 'all' | 'twitter' | 'youtube';

interface SidebarProps {
    onSelectFilter: (filter: ContentFilter) => void;
    activeFilter: ContentFilter;
}

export function Sidebar({ onSelectFilter, activeFilter }: SidebarProps) {

    const getItemClasses = (filterType: ContentFilter) => `
        flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
        ${activeFilter === filterType ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}
    `;

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-full p-6 flex flex-col shadow-lg">
            {/* Header / Logo */}
            <div className="flex items-center gap-2 mb-8 px-2">
                <Brain size={28} className="text-blue-600" />
                <h2 className="text-2xl font-extrabold text-gray-900">Brain</h2>
            </div>

            {/* Navigation List */}
            <ul className="space-y-3 flex-grow">
                <li
                    className={getItemClasses('all')}
                    onClick={() => onSelectFilter('all')}
                >
                    <span className="w-6 h-6 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </span>
                    <span className="font-medium text-lg">All Content</span>
                </li>
                <li
                    className={getItemClasses('twitter')}
                    onClick={() => onSelectFilter('twitter')}
                >
                    <Twitter size={24} />
                    <span className="font-medium text-lg">Twitter</span>
                </li>
                <li
                    className={getItemClasses('youtube')}
                    onClick={() => onSelectFilter('youtube')}
                >
                    <Youtube size={24} />
                    <span className="font-medium text-lg">YouTube</span>
                </li>
            </ul>

            <div className="mt-auto pt-6 border-t border-gray-200 text-sm text-gray-500">
                <p>Version 1.0</p>
            </div>
        </div>
    );
}