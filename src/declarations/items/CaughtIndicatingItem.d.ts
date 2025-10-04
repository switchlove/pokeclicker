/// <reference path="../enums/CaughtStatus.d.ts"/>
/// <reference path="./Item.d.ts"/>
declare abstract class CaughtIndicatingItem extends Item {
    abstract getCaughtStatus(): CaughtStatus;
}
