import { Component, OnInit } from '@angular/core';
import { Item } from '../../interfaces/Item';
import { User } from '../../interfaces/User';
import { NewItem } from '../../interfaces/newItem';
import { Setting } from '../../interfaces/Setting';
import { ItemsService } from '../../services/items.service';
import { UsersService } from '../../services/users.service';
import { SettingService } from '../../services/setting.service';
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  items: Item[] = [];
  users: User[] = [];
  showModal: boolean = false;
  item: NewItem = {
    id: 0,
    name: '',
    description: '',
    assignedUser: 0,
  }
  settings:Setting
  constructor(private itemsService: ItemsService, private userService: UsersService, private settingService: SettingService) { }

  ngOnInit(): void {
    this.loadSettings();
    this.getItems();
    this.getUsers();
  }

  getItems(): void {
    this.itemsService.getItems()
      .subscribe(data => this.items = data);
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(data => this.users = data);
  }
  loadSettings():void{
    this.settingService.getSettings().subscribe(data =>{
      this.settings = data
    })
  }
  cancelAdd(): void {
    this.item = {
      id: 0,
      name: '',
      description: '',
      assignedUser: 0,
    }
    this.showModal = false;
  }

  saveChanges(): void {
    this.itemsService.createItem(this.item).subscribe(res => {
      this.getItems();
      this.cancelAdd();
    });
  }

  addItem(): void {
    this.showModal = true;
  }

  editItem(item: Item): void {
    this.item.id = item.id;
    this.item.name = item.name;
    this.item.description= item.description;
    this.item.assignedUser = item.assignedUser;
    this.showModal = true;
  }

  delete(item: Item): void {
    if(confirm("Confirm delete Item")){
      this.itemsService.deleteItem(item.id).subscribe(_ => {
        this.items = this.items.filter(h => h !== item);  
      });
    }
  }
}
