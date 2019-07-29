import * as React from 'react';
import {IMyWebPartProps} from './IMyWebPartProps';
import ListSelected from './ListSelected/ListSelected'
import NoListSelected from './NoListSelected/NoListSelected'
import CreateNewListForm from './CreateNewListForm/CreateNewListForm'
import UrlNotFound from './UrlNotFound/UrlNotFound'
import {IItems} from "../MyWebPartInterfaces";

interface IState {
  window: 'ListSelected' | 'NoListSelected' | 'CreateNewListForm' | 'UrlNotFound';
  items:Array<IItems>;
}

export default class MyWebPart extends React.Component<IMyWebPartProps> {
  public state: IState = {
    window: this.props.isSiteFound ?
      this.props.list ? 'ListSelected' : 'NoListSelected'
      : 'UrlNotFound',
    items:this.props.items
  };

  public getSnapshotBeforeUpdate(prevProps: Readonly<IMyWebPartProps>,prevState): void {
    console.log(this.state,prevState,this.props,prevProps);
    if (this.props !== prevProps)
      this.setState({
        ...this.state,
        window: this.props.isSiteFound ?
          this.props.list ? 'ListSelected' : 'NoListSelected'
          : 'UrlNotFound',
        items:this.props.items
      });
  }

  public switchWindow = () => {
    switch (this.state.window) {
      case 'ListSelected':
        return <ListSelected
          items={this.state.items}/>;
      case 'NoListSelected':
        return <NoListSelected openForm={this.openForm}/>;
      case 'CreateNewListForm':
        return <CreateNewListForm
          createNewList={this.props.createNewList}/>;
      case 'UrlNotFound':
        return <UrlNotFound/>;
    }
  };

  public openForm = () => {
    this.setState({...this.state, window: 'CreateNewListForm'});
  };


  public render(): React.ReactElement<IMyWebPartProps> {
    return (
      <div>
        {this.switchWindow()}
      </div>
    );
  }
}
