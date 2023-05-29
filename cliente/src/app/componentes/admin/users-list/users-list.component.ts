import { Component } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.interface';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent {

  userInfo:any
  users:User[] = []
  isAdmin:boolean = false

  constructor(private userService:UsuariosService, private router: Router, private firestore:Firestore, private title:Title){ title.setTitle('Mediafroggy - Lista Usuarios')}

  async ngOnInit() {
    this.userInfo = await this.userService.getUserInfo()
      if(this.userInfo.admin) {
        this.isAdmin = true
        //Obtenemos array de users ya filtrados para no aparecers los Administradores y evitar eliminarlos.
        this.users = await (await this.userService.getAllUsers()).filter( user =>!user.admin)
        this.users.forEach(async user => {
          const q = query(collection(this.firestore, "users"), where("email", "==", user.email))
          const querySnapshots = await getDocs(q)
          user.id = querySnapshots.docs[0].id
        });
      }
  }

  async deleteUser(user:User){
    //user.idAuth="S0N0elq8EkhKixA54DntE9nX2I83"
    //this.userService.deleteAuth(user)
    await this.userService.deleteUser(user)
    window.location.reload();
  }

}
