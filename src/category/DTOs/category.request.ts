import { CategoryEntity } from "../category.entity";
import { IsString } from 'class-validator'


export class CategoryRequest {

    @IsString({message:"Digite o Nome da Categoria"})
    description:string;

    fromCategory(category:CategoryEntity){
        this.description = category.decription;
    }
}