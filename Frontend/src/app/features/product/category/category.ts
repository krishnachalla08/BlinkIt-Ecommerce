import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.html',
  styleUrls: ['./category.css'],
})
export class Category implements OnInit {
  categoryName: string = '';
  categories: any[] = [];
  constructor(private categoryService: CategoryService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  
  loadCategories() {
    this.categoryService.getAllCategories().subscribe(res => {
      this.categories = res;
      this.cd.detectChanges();
    });
  }

  addCategory() {
    if (!this.categoryName.trim()) return;

    this.categoryService.createCategory({ categoryName: this.categoryName }).subscribe((res: any) => {
      this.categories.unshift(res);
      this.categoryName = '';
      this.loadCategories();
    });
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }

}
