import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";

import { Board } from "../board-shared/board.model";
import { List } from "../board-shared/list.model";

import { BoardItemService } from "../board-services/board-item.service";
import { Card } from "../board-shared/card.model";

@Component({
  selector: "board-item",
  providers: [BoardItemService],
  templateUrl: "./board-item.component.html",
  styleUrls: ["./board-item.component.css"]
})
export class BoardItemComponent implements OnInit {
  showCreateList = false;
  board: Board;
  listItems: List[] = [];

  @ViewChild("listName") listName: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private boardItemService: BoardItemService
  ) {}

  getBoardInfo(): void {
    const id = this.route.snapshot.paramMap.get("id");
    this.boardItemService.getBoardInfo(id).then(value => {
      this.board = value;
    });
  }

  createList() {
    let list = new List(
      Math.floor(Math.random() * 1000) + 1,
      this.listName.nativeElement.value,
      [],
      this.board.id
    );
    this.board.list.push(list);
    this.boardItemService.saveBoard(this.board);
  }

  createCard(value: string, listId: number) {
    console.log(value);
    let card = new Card(Math.floor(Math.random() * 1000) + 1, value, false);
    this.board.list.find(x => x.id == listId).cards.push(card);
    this.boardItemService.saveBoard(this.board);
  }

  deleteCard(cardId: number, listId: number) {
    let cardIndex = this.board.list
      .find(x => x.id === listId)
      .cards.findIndex(i => i.id === cardId);
    this.board.list.find(x => x.id === listId).cards.splice(cardIndex, 1);
    this.boardItemService.saveBoard(this.board);
  }

  drop(event: CdkDragDrop<string[]>, listId: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.boardItemService.saveBoard(this.board);
  }

  ngOnInit(): void {
    this.getBoardInfo();
  }
}
