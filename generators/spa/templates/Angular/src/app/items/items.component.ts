import { Component, OnInit } from '@angular/core';
import { Item } from '../interfaces/Item';
import { Setting } from '../interfaces/Setting';
import { ItemsService } from '../services/items.service';
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
    this.getItems();
  }

  getItems(): void {
    this.itemsService.getItems()
      .subscribe(data => this.items = data);
  }

  delete(item: Item): void {
    this.itemsService.deleteItem(item.id).subscribe();
    this.items = this.items.filter(h => h !== item);
  }
}
