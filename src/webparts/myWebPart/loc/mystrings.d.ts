declare interface IMyWebPartWebPartStrings {
  PropertyPaneDescription: string;
  SiteSetting: string;
  DescriptionSiteUrlFieldLabel: string;
  DescriptionListsFieldLabel: string;
  DescriptionNumberOfItemsFieldLabel: string;
  DescriptionODataFilterFieldLabel: string;
}

declare module 'MyWebPartWebPartStrings' {
  const strings: IMyWebPartWebPartStrings;
  export = strings;
}
