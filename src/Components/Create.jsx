import { useState } from "react";
import axios from "axios";

function Create() {
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8080/data/posts", { content, });
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (<>
        <form onSubmit={handleSubmit}>
            <label htmlFor="content">Content:</label><br/>
            <input
                type="text"
                id="content"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <br/>
            <br/>
            <input type="submit" value="Submit" />
        </form>
    </>);
}

export default Create;
