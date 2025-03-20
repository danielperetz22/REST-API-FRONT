import { useState, FC } from "react";
import ItemsListStyle from "./ItemsList.module.css"

interface ItemsListProps {
    title: string,
    items: string[],
    Image : string
  
}


const ItemsList: FC<ItemsListProps> = ({ title, items , Image}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);


    console.log("PostsList render")

    const onClick = (index: number) => {
        console.log("click " + index)
        setSelectedIndex(index)
    }

    
    return (
        <div className={ItemsListStyle.container}>
            <h1>{title}</h1>
            <img src={Image} alt="image" />
            {items.length == 0 && <p>No items</p>}
            {items.length != 0 && (
         <ul>
         {items.map((item, index) => {
              return (
                <li
                  className={selectedIndex === index ? "list-group-item active" : "list-group-item"}
                  key={index}
                  onClick={() => onClick(index)}
                >
              {index} {item}
                </li>
           );
         })}
         </ul>
        )       }

        </div>
         )

    }

export default ItemsList
