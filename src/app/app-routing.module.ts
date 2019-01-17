import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "trello-clone",
    loadChildren: "./main/boards/board.module#BoardModule"
  },
  {
    path: "hackernews",
    loadChildren: "./main/hackernews/hackernews.module#HackerNewsModule"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}