import { Component, OnInit } from '@angular/core';
import { Item } from '../interfaces/Item';
import { Setting } from '../interfaces/Setting';
import { ItemsService } from '../items.service';
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  items: Item[] = [];
  settings: Setting[] = [];
  constructor(private itemsService: ItemsService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.itemsService.getItems()
      .subscribe(data => this.items = data);
  }

  // add(name: string): void {
  //   name = name.trim();
  //   if (!name) { return; }
  //   this.heroService.addHero({ name } as Hero)
  //     .subscribe(hero => {
  //       this.heroes.push(hero);
  //     });
  // }

  delete(item: Item): void {
    this.itemsService.deleteItem(item.itemId).subscribe();
    this.items = this.items.filter(h => h !== item);
  }
}
