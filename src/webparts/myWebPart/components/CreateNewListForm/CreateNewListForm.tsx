import * as React from 'react';
import {Simulate} from "react-dom/test-utils";

interface ICreateNewListFormProps{
  createNewList:Function;
}

const CreateNewListForm : React.FC<ICreateNewListFormProps> = ({createNewList}:ICreateNewListFormProps) => {
  let _name;
  return (
    <div>
      <input type="text" ref={input=>_name=input}/>
      <button onClick={()=>createNewList(_name.value)}>create</button>
    </div>
  );
};

export default CreateNewListForm;

