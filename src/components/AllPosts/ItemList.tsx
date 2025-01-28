import { useState, FC } from "react";
import ItemsListStyle from "./ItemsList.module.css"

interface ItemsListProps {
    title: string,
    items: string[],
    onItemSelected: (index: number) => void
}


const ItemsList: FC<ItemsListProps> = ({ title, items, onItemSelected }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [render, setRender] = useState(0)

    console.log("PostsList render")

    const onClick = (index: number) => {
        console.log("click " + index)
        setSelectedIndex(index)
    }

    const addItem = () => {
        console.log("add item")
        items.push("New item")
        setRender(render + 1)
    }

    const onSelect = () => {
        onItemSelected(selectedIndex)
    }
    return (
        <div className={ItemsListStyle.container}>
            <h1>{title}</h1>
            {items.length == 0 && <p>No items</p>}
            {items.length != 0 && <ul className="list-group">
                {items.map((item, index) => {
                    return <li
                        className={selectedIndex == index ? 'list-group-item active' : 'list-group-item'}
                        key={index}
                        onClick={() => { onClick(index) }}>
                        {index} {item}
                    </li>
                })}
            </ul>
            }
            <button className={'btn btn-primary m-3'} onClick={() => { addItem() }}>Add</button>
            <button className={'btn btn-primary'} onClick={() => { onSelect() }}>Select</button>
        </div>
    )

}

export default ItemsList
