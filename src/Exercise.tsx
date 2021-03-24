import React, { RefObject } from "react"
import {NoteDotProps} from "./NoteDot"
import StaticFretboard from "./StaticFretboard"
import NoteDotCollection, { NoteDotCollectionProps} from "./NoteDotCollection"
import { NoteChoices, NoteChoicesProps } from "./NoteChoices"
import GuitarTrainerSettings from "./GuitarTrainerSettings"

export class ExerciseState{
  noteDotPropsArray:NoteDotProps[]
  constructor(noteDotsProps:NoteDotProps[]){
    this.noteDotPropsArray = noteDotsProps
  }
}

export class Exercise extends React.Component {
  state:ExerciseState
  noteDotsCollectionRef:RefObject<NoteDotCollection>
 	constructor(props:any){
 		super(props)
    this.state = new ExerciseState([])
    this.noteDotsCollectionRef = React.createRef()
 	}
  onAnswer = (note:string) => {
    let correct:boolean = (note == this.getCurrentNoteName())
    if(correct){
      console.log("correct current:" + this.getCurrentNoteName() + " note:" + note)
      this.showNextDotPattern()
    }
    else{
      console.log("wrong current:" + this.getCurrentNoteName() + " note:" + note)
    }
  }
  onDotClick = () => {}
  showNextDotPattern = () => {
      let nextDotProps:NoteDotProps = this.selectNextDot()
      this.setState(new ExerciseState([nextDotProps]))
  }
  getCurrentNoteName = () => {
    return (this.state.noteDotPropsArray[0])?this.state.noteDotPropsArray[0].noteName:Math.random().toString()
  }
  selectNextDot = ():NoteDotProps => {
    let currentNoteName = this.getCurrentNoteName()
    let nextDotProps:NoteDotProps = this.getNextDotProps()
    if(currentNoteName == nextDotProps.noteName){
      return this.selectNextDot()
    }
    return nextDotProps
  }
  getNextDotProps = () => {
    let stringIndex = this.getNextStringIndex()
    let fretIndex = this.getNextFretIndex()
    let selectedNoteName:string = GuitarTrainerSettings.guitar.getNoteNameForPosition(stringIndex, fretIndex)
    return new NoteDotProps(fretIndex, stringIndex, this.onDotClick, selectedNoteName, 3)
  }
  getNextFretIndex = () => {
    let activeFrets:number[] = [0,1,2,3,4]
    return activeFrets[Math.floor( Math.random() * (activeFrets.length) )]
  }
  getNextStringIndex = () => {
    return Math.floor(Math.random() * 3)
  }
  componentDidMount = () =>{
    this.showNextDotPattern()
  }
  render(){
    return  <>
              <text fontSize="50">Exercise</text>
              <g className="exercise">
                <StaticFretboard/>
                <NoteDotCollection {...new NoteDotCollectionProps(this.state.noteDotPropsArray)} ref={this.noteDotsCollectionRef}/>
                <NoteChoices {...new NoteChoicesProps(this.onAnswer)} />
              </g>
            </>
  }
}
export default Exercise
