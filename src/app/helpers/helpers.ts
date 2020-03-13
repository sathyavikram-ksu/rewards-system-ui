import { groupBy } from 'lodash';
import { Purchase, PurchaseType } from '../models/purchase';
export const HOST_URL = 'http://localhost:8080/';
export const ACCESS_TOKEN = 'accessToken';
export const USER_NAME = 'userName';

export function getUrl(uri: string) {
    return HOST_URL + uri;
}

export function getPickUpDate(pickUpDateTimeStr: string) {
    const selectedPickUpDateTime = new Date(pickUpDateTimeStr);
    const selectedPickUpDate = new Date(selectedPickUpDateTime.getFullYear(), selectedPickUpDateTime.getMonth(), selectedPickUpDateTime.getDate());
    return selectedPickUpDate.getTime();
}

export function getFreeCountByMonth(purchaseList: Purchase[]) {
    let totalFreeCount = 0;
    if (purchaseList && purchaseList.length > 0) {
        const groupedResults = groupBy(purchaseList, (purchaseObj: Purchase) => {
            const purchaseDate = new Date(purchaseObj.createdAt);
            return purchaseDate.getFullYear() + '-' + purchaseDate.getMonth();
        });
        const monthKeys = Object.keys(groupedResults);
        monthKeys.forEach(key => {
            const pointsCountPerMonth = groupedResults[key].reduce((value: number, previousObj: Purchase) => value + previousObj.points, 0);
            if (pointsCountPerMonth < 50) {
                delete groupedResults[key];
            }
        });
        const totalClaims = purchaseList.filter(purchaseObj => purchaseObj.purchaseType == PurchaseType.MONTHLY_FREE_FOR_50);
        totalFreeCount = Object.keys(groupedResults).length - totalClaims.length;
    }
    return totalFreeCount > 0 ? totalFreeCount : 0;
}

export function isGoldCustomer(purchaseList: Purchase[]) {
    let totalPoints = 0;
    if (purchaseList && purchaseList.length > 0) {
        totalPoints = purchaseList.reduce((value: number, previousObj: Purchase) => value + previousObj.points, 0);
    }
    return totalPoints >= 1000;
}

export function getFreeCountByGold(purchaseList: Purchase[]) {
    let totalFreeCount = 0;
    if (isGoldCustomer(purchaseList)) {
        const groupedResults = groupBy(purchaseList, (purchaseObj: Purchase) => {
            const purchaseDate = new Date(purchaseObj.createdAt);
            return purchaseDate.getFullYear() + '-' + purchaseDate.getMonth();
        });
        const currentDate = new Date();
        const monthKey = currentDate.getFullYear() + '-' + currentDate.getMonth();
        const currentMonthPurchases = groupedResults[monthKey];
        if (currentMonthPurchases && currentMonthPurchases.length > 0) {
            const goldPurchase = currentMonthPurchases.find(purchaseObj => purchaseObj.purchaseType == PurchaseType.MONTHLY_FREE_FOR_GOLD);
            totalFreeCount = goldPurchase ? 0 : 1;
        }
    }
    return totalFreeCount;
}