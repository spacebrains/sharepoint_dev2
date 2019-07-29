import {IPropertyPaneDropdownOption} from "@microsoft/sp-property-pane/lib";
import {IItems} from "../MyWebPartInterfaces";

export interface IMyWebPartProps {
  isSiteFound?:boolean;
  list:IPropertyPaneDropdownOption;
  items:Array<IItems>;
  createNewList:Function;
}
