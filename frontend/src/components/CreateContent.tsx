import { CgClose } from "react-icons/cg";
import { Input } from "./ui/Input";
import { useRef, useState } from "react";
import { Button } from "./ui/Button";
import axios from "axios";
import { BACKEND_URL } from "../config";

enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter"
}

interface CreateModalProps {
    open: boolean;
    onClose: () => void;
    onContentAdded?: () => void;
}

export function CreateModal({ open, onClose, onContentAdded }: CreateModalProps) {
    const titleRef = useRef<HTMLInputElement>(null); 
    const linkRef = useRef<HTMLInputElement>(null);
    const [selectedType, setSelectedType] = useState<ContentType>(ContentType.Youtube);

    async function AddContent() {
        
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;
        const typeToSend = selectedType;

        // Basic validation
        if (!title || !link || !typeToSend) {
            alert("Please fill in all fields (Title, Link, and select a Type).");
            return;
        }

        try {
            await axios.post(`${BACKEND_URL}/content`, {
                title,
                link,
                type: typeToSend 
            },{
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });

            // Reset the input fields
            if (titleRef.current) titleRef.current.value = '';
            if (linkRef.current) linkRef.current.value = '';
            setSelectedType(ContentType.Youtube); 
            // Call optional callback to refresh content in parent
            if (onContentAdded) {
                onContentAdded();
            }

            onClose();

        } catch (error) {
            console.error("Error adding content:", error);
            // Provide user feedback on error
            alert("Failed to add content. Please try again.");
        }
    }

    return (
        <div>
            {open && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm`}>
                    <div className="bg-white z-60 rounded-lg shadow-lg p-6 w-full max-w-md ">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Create Content</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                <CgClose size={24} />
                            </button>
                        </div>

                        <div className="space-y-4"> {/* Added spacing */}
                            <Input ref={titleRef} placeholder="Title"/>
                            <Input ref={linkRef} placeholder="Link" />
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Select Content Type</label>
                                <div className="flex gap-2"> {/* Added gap between buttons */}
                                    <Button
                                        text="YouTube"
                                        size="md"
                                        varaint={selectedType === ContentType.Youtube ? "primary" : "secondary"}
                                        onClick={() => setSelectedType(ContentType.Youtube)}
                                    />
                                    <Button
                                        size="md"
                                        text="Twitter"
                                        varaint={selectedType === ContentType.Twitter ? "primary" : "secondary"}
                                        onClick={() => setSelectedType(ContentType.Twitter)}
                                    />
                                </div>
                            </div>
                            <Button
                                varaint="primary"
                                size="md"
                                text="Submit"
                                onClick={AddContent}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}