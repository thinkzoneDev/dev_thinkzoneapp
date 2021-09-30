import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data: any;
  private document_list: DataObject[];
  constructor() {
    this.data = {};
   }

  setData(key: string, d: any) {
    this.data[key] = d;
  }

  getData(key: string) {
    return this.data[key];
  }

  setDocumentData(list: DataObject[]) {
    this.document_list = list;
  }

  getDocumentData(): {
    path: string,
    played: boolean
  }[] {
    return this.document_list;
  }
}

export interface DataObject {
  path: string;
  played: boolean;
  file_name?: string;
}