import { Component, EventEmitter, Output, Input } from "@angular/core";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent {

  @Output() appSelected = new EventEmitter<string>();
  @Input()  highlightSelectedApp: string;

  onAppSelect(name:string){
    this.appSelected.emit(name);
  }
}
