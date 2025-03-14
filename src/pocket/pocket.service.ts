import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pocket } from '../models/pocket.model';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PocketService {
  constructor(
    @InjectModel('pocket') private readonly pocketModel: Model<Pocket>,
  ) {}
  public async insertPocketItem(
    owner: string,
    link: string,
    title: string,
    image: string,
    description: string,
    name?: string,
  ): Promise<Pocket | undefined> {
    try {
      const id = uuidv4();
      const pocketName = name ? name : '';
      const createdAt = Date.now();
      const newPocketItem = new this.pocketModel({
        id,
        owner,
        link,
        createdAt,
        name: pocketName,
        title,
        description,
        image,
      });
      await newPocketItem.save();
      return newPocketItem;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  public async getPockets(id: string): Promise<Pocket[] | undefined> {
    try {
      const pocket = await this.pocketModel.find({
        owner: id,
      });
      return pocket;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  public async deletePocketItem(id: string): Promise<any> {
    try {
      const res = await this.pocketModel.findOneAndDelete({
        id,
      });
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
