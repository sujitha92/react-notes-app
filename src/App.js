import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"
import "react-mde/lib/styles/css/react-mde-all.css";

/**
 * Challenge: complete and implement the deleteNote function
 *
 * Hints:
 * 1. What array method can be used to return a new
 *    array that has filtered out an item based
 *    on a condition?
 * 2. Notice the parameters being based to the function
 *    and think about how both of those parameters
 *    can be passed in during the onClick event handler
 */
export default function App() {
  /* lazy state initialization  of`notes` state, so it doesn't
  reach into localStorage on every single re-render
  of the App component */

  const [notes, setNotes] = React.useState( ()=>JSON.parse(localStorage.getItem("notes")) || [])
  const [currentNoteId, setCurrentNoteId] = React.useState(
      (notes[0] && notes[0].id) || ""
  )

  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
    //console.log(JSON.stringify(notes));
  }, [notes])

  function deleteNote(event,noteId) {
    event.stopPropagation()
    setNotes(oldNotes=>oldNotes.filter(oldNote=>oldNote.id!==noteId));
  }

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here"
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
  }

  function updateNote(text) {
    // Put the most recently-modified note at the top
    setNotes(oldNotes =>{
        let newArr = [];
        for(let i=0;i<oldNotes.length;i++){
          if(oldNotes[i].id === currentNoteId){
            newArr.unshift({ ...oldNotes[i], body: text })
          }else{
            newArr.push(oldNotes[i]);
          }
        }

        return newArr;
    })


    // This does not rearrange the notes
    // setNotes(oldNotes => oldNotes.map(oldNote => {
    //   return oldNote.id === currentNoteId
    //       ? { ...oldNote, body: text }
    //       : oldNote
    // }))
  }

  function findCurrentNote() {
    return notes.find(note => {
      return note.id === currentNoteId
    }) || notes[0]
  }

  return (
      <main>
        {
          notes.length > 0
              ?
              <Split
                  sizes={[30, 70]}
                  direction="horizontal"
                  className="split"
              >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId &&
                    notes.length > 0 &&
                    <Editor
                        currentNote={findCurrentNote()}
                        updateNote={updateNote}
                    />
                }
              </Split>
              :
              <div className="no-notes">
                <h1>You have no notes</h1>
                <button
                    className="first-note"
                    onClick={createNewNote}
                >
                  Create one now
                </button>
              </div>

        }
      </main>
  )
}
