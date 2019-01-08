import { Component, Input, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {
  selectedApp: string;
  title = "This is the Main Component";
  private id;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.selectedApp = this.route.snapshot.paramMap.get('appName');
    if(this.selectedApp == null){
      this.router.navigate(['/trello-clone']); //Default App
    }
  }
}