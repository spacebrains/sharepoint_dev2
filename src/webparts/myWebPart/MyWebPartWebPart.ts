import * as React from 'react';
import * as ReactDom from 'react-dom';
import {Version} from '@microsoft/sp-core-library';
import {BaseClientSideWebPart} from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  PropertyPaneSlider,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import {IODataList} from '@microsoft/sp-odata-types';
import * as strings from 'MyWebPartWebPartStrings';
import MyWebPart from './components/MyWebPart';
import {IMyWebPartProps} from './components/IMyWebPartProps';
import {SPHttpClient} from '@microsoft/sp-http';
import {IItems} from './MyWebPartInterfaces'

export interface IMyWebPartWebPartProps {
  siteUrl: string;
  list: IPropertyPaneDropdownOption;
  numberOfItems: number;
  ODataFilter: string;
}

export default class MyWebPartWebPart extends BaseClientSideWebPart<IMyWebPartWebPartProps> {
  private options: Array<IPropertyPaneDropdownOption> = [];
  private isSiteFound: boolean = true;
  private items: Array<IItems> = [];
  private selectedKey: string | number;

  private loadOptions = async (): Promise<void> => {
    try {
      let url = (this.properties.siteUrl || '') + `/_api/web/lists?$filter=Hidden eq false`;
      const response = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
      const json = await response.json();
      this.options = await json.value.map((list: IODataList) => {
        return {key: list.Id, text: list.Title}
      });

      this.context.propertyPane.refresh();

      this.isSiteFound = true;
      this.render();

    } catch (err) {
      if (this.isSiteFound) {
        this.isSiteFound = false;
        this.render();
      }
      console.error(err);
    }
  };

  private loadItems = async (): Promise<void> => {
    if (!this.properties.list) return null;
    try {
      const url = `${this.properties.siteUrl || ''}/_api/web/lists/getbyid('${
        this.properties.list
        }')/items?$top=${
        this.properties.numberOfItems
        }${
        this.properties.ODataFilter ? `&$select=${this.properties.ODataFilter}` : ''}`;

      const response = await this.context.spHttpClient.get(url, SPHttpClient.configurations.v1);
      const json = await response.json();
      const items = json.value;
      this.items = items.map(i => {
        return {Title: i.Title, ID: i.ID}
      });

      this.render()
    } catch (err) {
      console.error(err)
    }
  };

  private createNewList = async (name = '4'): Promise<void> => {
    try {
      const url = `${this.properties.siteUrl || ''}/_api/web/lists/`;
      const body = {
        'Title': name,
        'BaseTemplate': 100,
        '__metadata': {'type': 'SP.List'}
      };
      const response = await this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, {
          headers: {
            "accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "odata-version": ""
          },
          body: JSON.stringify(body)
        }
      );
      let json = await response.json();
      this.properties.list = json.d.Id;
      this.selectedKey = json.d.Id;
      await this.context.propertyPane.refresh();
      this.render();

    } catch (err) {
      console.error(err);
    }
  };

  protected onInit(): Promise<void> {
    return this.loadOptions() && this.loadItems();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    switch (propertyPath) {
      case 'siteUrl':
        this.options = [];
        this.loadOptions();
        break;
      case 'list':
        this.loadItems();
        break;
      case 'numberOfItems':
        this.loadItems();
        break;
      case 'ODataFilter':
        this.loadItems();
        break;
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.SiteSetting,
              groupFields: [
                PropertyPaneTextField('siteUrl', {
                  label: strings.DescriptionSiteUrlFieldLabel,
                  placeholder: '...'
                }),
                PropertyPaneDropdown('list', {
                  label: strings.DescriptionListsFieldLabel,
                  options: this.options,
                  selectedKey: this.selectedKey
                }),
                PropertyPaneSlider('numberOfItems', {
                  label: strings.DescriptionNumberOfItemsFieldLabel,
                  min: 1,
                  max: 20,
                  value: 5,
                  showValue: true,
                  step: 1
                }),
                PropertyPaneTextField('ODataFilter', {
                  label: strings.DescriptionODataFilterFieldLabel,
                  placeholder: '...'
                })
              ]
            }
          ]
        }
      ]
    };
  }


  public render(): void {
    const element: React.ReactElement<IMyWebPartProps> = React.createElement(
      MyWebPart,
      {
        list: this.properties.list,
        isSiteFound: this.isSiteFound,
        items: this.items,
        createNewList: this.createNewList
      }
    );
    ReactDom.render(element, this.domElement);
  }


  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected static get dataVersion(): Version {
    return Version.parse('1.0');
  }

}
