const queueActionTypes = [
    {type: 0, fromType: 1, description: "Rəflə", status: "warning", tookTitle: "Müştəriyə təhvil ver"},
    {type: 1, fromType: 0, description: "Müştəri", status: "success", tookTitle: "Müştəriyə təhvil ver"},
    {type: 0, fromType: 0, description: "Paketlə", status: "info", tookTitle: "Paketçiyə təhvil ver"},
    {type: 3, fromType: 3, description: "Paketlə", status: "info", tookTitle: "Paketçiyə təhvil ver"},
    {type: 1, fromType: 1, description: "Paketlə", status: "info", tookTitle: "Paketçiyə təhvil ver"},
    {type: 0, fromType: 3, description: "Kuriyer", status: "info", tookTitle: "Kuriyerə təhvil ver"},
]

export function getQueueActionType(type, fromType) {
    return  queueActionTypes.find(actionType => actionType.type === type && actionType.fromType === fromType);
}
