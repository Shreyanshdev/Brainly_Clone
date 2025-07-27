import '../App.css';
import { Card } from '../components/Card';
import { CreateModal } from '../components/CreateContent';
import { Button } from '../components/ui/Button';
import { ArrowRight, Plus } from "lucide-react";
import { useState, useEffect } from 'react'; // Import useEffect
import { Sidebar, type ContentFilter } from '../components/Sidebar';
import { useContent } from '../hooks/useContent';

// Extend the Window interface to include twttr for TypeScript
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    twttr?: any; 
  }
}

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  interface ContentItem {
    type: "twitter" | "youtube"; 
    link: string;
    title: string;
    _id?: string;
  }

  const { content, loading }: { content: ContentItem[]; loading: boolean } = useContent();
  const [refreshKey, setRefreshKey] = useState(0); 
  const [activeFilter, setActiveFilter] = useState<ContentFilter>('all');

  useEffect(() => {

    if (window.twttr && content.some(item => item.type === 'twitter')) {
      setTimeout(() => {
        window.twttr.widgets.load();
        console.log("Twitter widgets reloaded.");
      }, 100); 
    }
  }, [content, refreshKey]); 

  const handleContentAdded = () => {
    setModalOpen(false); // Close modal
    setRefreshKey(prevKey => prevKey + 1); 
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading content...</div>
      </div>
    );
  }

  if (!Array.isArray(content)) {
    console.error("Content received from useContent is not an array:", content);
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error loading content. Please refresh or try again.
      </div>
    );
  }

//  const validatedContent = Array.isArray(content) ? content : [];

//   const filteredContent = validatedContent.filter(item => {
//     // Add a check to ensure item is a valid object before accessing 'type'
//     if (!item || typeof item !== 'object' || !('type' in item)) {
//         console.warn("Skipping malformed item during filter:", item);
//         return false;
//     }
//     if (activeFilter === 'all') {
//       return true;
//     }
//     return item.type === activeFilter;
//   });

  return (
    <>
      <div className='flex h-screen'>
        <Sidebar onSelectFilter={setActiveFilter} activeFilter={activeFilter}/>
        <div className='ml-2 h-screen flex-grow p-4'>
          <CreateModal
            open={modalOpen}
            onClose={() => {setModalOpen(false)}}
            onContentAdded={handleContentAdded} 
          />
          <div className='flex justify-end gap-4 mb-4'>
            <Button
              varaint="primary"
              size="md"
              text="Add Content"
              startIcon={<Plus size={16} />}
              onClick={() => {setModalOpen(true)}}
            />
            <Button
              varaint="secondary"
              size="md"
              text="Share Brain"
              startIcon={<ArrowRight size={16} />}
              onClick={() => {}}
            />
          </div>
          <div className='flex gap-4'>
            {content.length > 0 ? (
              content.map((item, index) =>
                item && typeof item === 'object' && 'type' in item && 'link' in item && 'title' in item ? (
                  <Card key={item._id || index} type={item.type} link={item.link} title={item.title} />
                ) : (
                  <div key={index} className="bg-red-100 p-2 rounded text-red-700">
                      Warning: Malformed content item. {JSON.stringify(item)}
                  </div>
                )
              )
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                No content found. Add some content to your brain!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;