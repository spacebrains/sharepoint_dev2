import * as React from 'react';

interface INoListSelectedProps{
  openForm:Function
}

const NoListSelected : React.FC<INoListSelectedProps> = ({openForm}:INoListSelectedProps) => {
  return (
    <span>
      choice a list <br/>
      or <br/>
      <button onClick={()=>openForm()}>create new</button>
    </span>
  );
};

export default NoListSelected;

