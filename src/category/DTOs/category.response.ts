import { CategoryEntity } from "../category.entity";

export class CategoryResponse {
    description: string;
    createDate: Date;

    static fromCategory(category: CategoryEntity): CategoryResponse {

        return {
            description: category.decription,
            createDate: category.createDate
        }
    }

    static fromCategories(
        categories: CategoryEntity[]
    ): CategoryResponse[] {
        return categories.map(CategoryResponse.fromCategory);
    }
}