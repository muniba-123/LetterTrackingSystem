import React from 'react'
import { Link } from 'react-router-dom'
import selected from '../Assets/icons/selected.svg'
import circle from '../Assets/icons/circle.svg'

const Pager = props => {
  const { count, page, onChange } = props
  return (
    <div className={'w-100 py-2'}>
      <div className='d-flex justify-content-center' id='paginationBlock'>
        <div className='d-flex'>
          {[...Array(count).keys()]?.map((val, key) => (
            <div key={key}>
              {val + 1 === page ? (
                <div className='px-1'>
                  <img alt="" src={selected} />
                </div>
              ) : (
                <Link
                  to='#'
                  onClick={() => {
                    onChange(val + 1)
                  }}
                >
                  <div className='px-1'>
                    <img alt="" src={circle} />
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pager
