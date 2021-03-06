import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Chapter } from '../bhagavadgita-shared/models/chapter.model';
import { Verse } from '../bhagavadgita-shared/models/verse.model';
import { BhagavadGitaService } from '../bhagavadgita-shared/services/bhagavadgita.service';
import { TokenService } from '../bhagavadgita-shared/services/token.service';

@Component({
  selector: 'bhagavadgita-chapter',
  templateUrl: './bhagavadgita-chapter.component.html',
  styleUrls: [
    './bhagavadgita-chapter.component.css',
    '../bhagavadgita.component.css'
  ]
})
export class BhagavadGitaChapterComponent implements OnInit {
  title = 'This is the BhagavadGita Chapter Component';
  currentChapterNumber: number;
  chapterDetails: Chapter;
  totalVerseCount: number;
  verses: Observable<Verse[]>;
  p: number = 1;

  showChapterSpinner = true;
  showVerseSpinner = true;

  constructor(
    private bgService: BhagavadGitaService,
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: TokenService
  ) {}

  // Get Chapter Details and All Verses of the Chapter
  loadDetails() {
    this.currentChapterNumber = Number(this.route.snapshot.paramMap.get('id'));
    // Get Chapter Details
    this.getChapterInfo(this.currentChapterNumber);
    // Get Verses for a chapter
    this.getChapterVerses(this.currentChapterNumber);
  }

  getChapterInfo(chapterNumber: number) {
    this.bgService.getChapter(chapterNumber).subscribe(
      (data: Chapter) => {
        this.showChapterSpinner = false;
        this.chapterDetails = data;
        this.totalVerseCount = data.verses_count;
      },
      error => {
        if (error.status == 401) {
          this.tokenService.obtainAccessToken().subscribe((data: any) => {
            this.tokenService.deleteToken();
            this.tokenService.saveToken(data.access_token);
            this.getChapterInfo(this.currentChapterNumber);
          });
        }
      }
    );
  }

  getChapterVerses(chapterNumber: number) {
    this.bgService.getVersesForChapter(chapterNumber).subscribe(
      (data: Verse[]) => {
        this.showVerseSpinner = false;
        this.verses = of(data);
      },
      error => {
        if (error.status == 401) {
          this.tokenService.obtainAccessToken().subscribe((data: any) => {
            this.tokenService.deleteToken();
            this.tokenService.saveToken(data.access_token);
            this.getChapterVerses(this.currentChapterNumber);
          });
        }
      }
    );
  }

  navigateToVerse(verseNumber: string) {
    let navigationExtras: NavigationExtras = {
      state: {
        chapterNumber: this.currentChapterNumber.toString(),
        verseNumber: verseNumber,
        totalVerseCount: this.totalVerseCount
      },
      relativeTo: this.route.parent
    };
    this.router.navigate(
      ['chapters', this.currentChapterNumber, 'verse', verseNumber],
      navigationExtras
    );
  }

  ngOnInit() {
    this.loadDetails();
  }
}
