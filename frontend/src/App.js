import { BrowserRouter, Routes, Route } from "react-router-dom";
import StoryList from "./components/StoryList";
import AddStory from "./components/AddStory";
import EditStory from "./components/EditStory";
import AddChapter from "./components/AddChapter";
import UpdateChapter from "./components/EditChapter";
import StoryDetail from "./components/StoryDetail";


function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<StoryList />} />
          <Route path="add" element={<AddStory />} />
          <Route path="edit/:id" element={<EditStory />} />

          <Route path=":id/addChapter" element={<AddChapter />} />
          <Route path="/edit/:id/update/:chapterId" element={<UpdateChapter />} />
          <Route path="/detail/:id" element={<StoryDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
