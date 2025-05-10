import { MouseEvent, useContext, useEffect, useRef, useState } from 'react'
import { ICoreContext, IFileUpload, IResourceContext, IUserContext } from '../../../../utils/interfaces.util'
import ResourceContext from '../../../../context/resource/resourceContext'
import Badge from '../../../../components/partials/badges/Badge'
import Button from '../../../../components/partials/buttons/Button'
import UserContext from '../../../../context/user/userContext'
import { useParams } from 'react-router-dom'
import Placeholder from '../../../../components/partials/Placeholder'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import storage from '../../../../utils/storage.util'
import helper from '../../../../utils/helper.util'
import AxiosService from '../../../../services/axios.service'
import { FormActionType } from '../../../../utils/types.util'
import CareerForm from './CareerForm'
import RoundButton from '../../../../components/partials/buttons/RoundButton'
import Icon from '../../../../components/partials/icons/Icon'
import Fileog from '../../../../components/partials/dialogs/Fileog'
import CoreContext from '../../../../context/core/coreContext'
import useCopyText from '../../../../hooks/useCopyText'

const CareerDetailsPage = () => {

  const dpRef = useRef<any>(null)

  const { id } = useParams();

  const { copyText } = useCopyText()

  const resourceContext = useContext<IResourceContext>(ResourceContext)
  const userContext = useContext<IUserContext>(UserContext)
  const coreContext = useContext<ICoreContext>(CoreContext)

  const [file, setFile] = useState<IFileUpload | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [passwordChange, setPasswordChange] = useState({
    password: '',
    code: '',
    error: ''
  })

  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [form, setForm] = useState<{ action: FormActionType, careerId: string }>({ action: 'edit-resource', careerId: '' })

  useEffect(() => {
    initSidebar()

    if (id) {
      getCareer(id)
    }

  }, [])

  const getCareer = (id: string) => {
    coreContext.getCareer(id)
  }

  const togglePanel = (e: any, form?: { action: FormActionType, id?: string }) => {
    if (e) { e.preventDefault() }

    if (!showPanel && form) {
      setForm({ action: form.action, careerId: form.id ? form.id : '' })
    }

    setShowPanel(!showPanel)

  }

  const initSidebar = () => {

    const result = userContext.currentSidebar(userContext.sidebar.collapsed);
    if (result) {
      userContext.setSidebar(result)
    }

  }

  return (
    <>


      <div className="details-header">

        <div className="halve left-halve">

          <div>

            <div className={`avatar rg ui-full-bg bg-center ${loading ? 'disabled-light' : ''}`}>

              <span className="font-hostgro-bold pab-900 fs-20 ui-upcase">{helper.getInitials(`${coreContext.career.name || '-------'}`)}</span>

            </div>

          </div>

          <div className='pdl1 ui-line-height-medium'>

            <div onClick={(e) => { console.log(file?.base64) }} className="mrgb0 font-hostgro-bold fs-20 color-black ui-capitalize mrgb0">
              {
                coreContext.loading ?
                  <Placeholder height='17px' width="160px" radius={'10px'} bgColor='#eceaf1' animate={true} />
                  : <>{`${coreContext.career.name}` || '--------'}</>
              }
            </div>

            <div className="font-hostgro fs-14 pag-500 mrgb0 ui-capitalize d-flex align-items-center">
              {
                coreContext.loading ?
                  <Placeholder height='17px' width="160px" radius={'10px'} bgColor='#eceaf1' animate={true} />
                  :
                  <>
                    <span className='fs-14 font-hostgro'>{coreContext.career.code || '--------'} </span>
                    <Icon
                      type='feather'
                      name='copy'
                      clickable={true}
                      size={15}
                      onClick={(e) => copyText(e, coreContext.career.code)}
                      className='pdl pab-500'
                    />
                  </>
              }

            </div>

          </div>

        </div>

        <div className="halve right-halve">

          <div className={`actions ${loading || coreContext.loading ? 'disabled-light' : ''}`}>

            <Button
              text="Edit"
              type="ghost"
              size="msm"
              semantic='ongoing'
              loading={false}
              disabled={false}
              block={false}
              fontSize={14}
              reverse="row"
              fontWeight={'medium'}
              lineHeight={16}
              className="edit-btn"
              style={{ width: '83px' }}
              icon={{
                enable: true,
                type: 'polio',
                name: 'edit',
                size: 15,
              }}
              onClick={(e) => togglePanel(e)}
            />
            <Button
              text="Disable"
              type="ghost"
              size="msm"
              semantic='info'
              reverse="row"
              loading={false}
              disabled={false}
              block={false}
              fontSize={13}
              fontWeight={'medium'}
              lineHeight={16}
              className="form-button"
              icon={{
                enable: true,
                type: 'feather',
                name: 'x',
                size: 13
              }}
              onClick={(e) => { }}
            />

          </div>

        </div>

      </div>

      <div className="ui-separate-mini">
        <div className="ui-line bg-pag-50"></div>
      </div>

      <div className="details-block">

        <div className="row">

          <div className='col-xl-4 col-lg-6 col-md-6 col-12'>

            <div className="mrgb1 lg-mrgb md-mrgb ">
              <span className='fs-14 color-black-neutral pdr'>Career Name:</span>

              {
                coreContext.loading ?
                  <Placeholder height='17px' width="160px" radius={'10px'} bgColor='#eceaf1' animate={true} />
                  : <span className='font-hostgro fs-14 pag-500'> {coreContext.career.name || '------'} </span>
              }

            </div>
            <div className="mrgb0">
              <span className='font-hostgro fs-14 color-black-neutral pdr'>Label:</span>

              {
                coreContext.loading ?
                  <Placeholder height='17px' width="160px" radius={'10px'} bgColor='#eceaf1' animate={true} />
                  :
                  <span className='font-hostgro fs-14 font-hostgro fs-14 pag-500 ui-capitalize'> {coreContext.career.label || '-------'} </span>
              }

            </div>

          </div>

          <div className='col-xl-4 col-lg-6 col-md-6 col-12  mrgb0 lg-mrgb1-mid md-mrgb1'>
            <div className="mrgb1  lg-mrgb md-mrgb">
              <span className='font-hostgro fs-14 color-black-neutral pdr'>Fields:</span>

              {
                coreContext.loading ?
                  <Placeholder height='17px' width="160px" radius={'10px'} bgColor='#eceaf1' animate={true} />
                  : <span className='font-hostgro fs-14 pag-500'> {coreContext.career.fields?.length || 0} </span>
              }

            </div>
            <div className="mrgb0 ">
              <span className='font-hostgro fs-14 color-black-neutral pdr'>Code:</span>

              {
                coreContext.loading ?
                  <Placeholder height='17px' width="160px" radius={'10px'} bgColor='#eceaf1' animate={true} />
                  : <span className='font-hostgro fs-14 pag-500'> {coreContext.career.code || '-------'} </span>
              }

            </div>

          </div>

          <div className='col-xl-4 col-lg-6 col-md-6 col-12  mrgb0 lg-mrgb1-mid md-mrgb1'>
            <div className="mrgb1  lg-mrgb md-mrgb">
              <span className='font-hostgro fs-14 color-black-neutral pdr'>Synonyms:</span>

              {
                coreContext.loading ?
                  <Placeholder height='17px' width="160px" radius={'10px'} bgColor='#eceaf1' animate={true} />
                  : <span className='font-hostgro fs-14 pag-500 text-lowercase'> {helper.joinText(coreContext?.career?.synonyms, ',')} </span>
              }

            </div>

          </div>

        </div>

      </div>

      <CareerForm
        show={showPanel}
        closeForm={togglePanel}
        type={form.action}
        careerId={form.careerId}
        display="details"
        title={'Edit Career'}

      />
    </>

  )
}

export default CareerDetailsPage
