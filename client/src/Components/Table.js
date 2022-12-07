import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

const { SearchBar } = Search;
export function Table(props) {
    const {data,columns,search}=props;
    return(
        <ToolkitProvider
  keyField="id"
  data={ data } columns={ columns } 
  search
>
  {
    props => {
     return <div>
        {search && <SearchBar { ...props.searchProps } />}
        <BootstrapTable
          { ...props.baseProps }
        />
      </div>
}
  }
</ToolkitProvider>
 
    )
}