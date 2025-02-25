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
import FieldForm from './FieldForm'
import RoundButton from '../../../../components/partials/buttons/RoundButton'
import Icon from '../../../../components/partials/icons/Icon'
import Fileog from '../../../../components/partials/dialogs/Fileog'
import CoreContext from '../../../../context/core/coreContext'

const FieldDetailsPage = () => {

  const dpRef = useRef<any>(null)

  const { id } = useParams();

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
  const [form, setForm] = useState<{ action: FormActionType, fieldId: string }>({ action: 'edit-resource', fieldId: '' })

  useEffect(() => {
    initSidebar()

    if (id) {
      getField(id)
    }

  }, [])

  const getField = (id: string) => {
    coreContext.getField(id)
  }

  const togglePanel = (e: any, form?: { action: FormActionType, id?: string }) => {
    if (e) { e.preventDefault() }

    if (!showPanel && form) {
      setForm({ action: form.action, fieldId: form.id ? form.id : '' })
    }

    setShowPanel(!showPanel)

  }

  const copy = (e: MouseEvent<HTMLElement>, text: string) => {

    if (e) e.preventDefault()

    storage.copyCode(text)
    resourceContext.setToast({
      ...resourceContext.toast,
      show: true,
      type: 'info',
      message: `Code ${text} copied to clipboard`
    })

  }

  const configTab = (e: any, val: any) => {
    if (e) { e.preventDefault(); }
    storage.keep('staff-details-tab', val.toString())
  }

  const initSidebar = () => {

    const result = userContext.currentSidebar(userContext.sidebar.collapsed);
    if (result) {
      userContext.setSidebar(result)
    }

  }

  const updateAvatar = async (e: any) => {

    if (e) { e.preventDefault(); }

    if (!file || (file && !file.base64)) {
      resourceContext.setToast({
        ...resourceContext.toast,
        show: true,
        type: 'error',
        message: 'Select staff avatar!'
      });
    } else {

      setLoading(true);

      const response = await AxiosService.call({
        type: 'core',
        method: 'PUT',
        path: `/fields/${coreContext.field._id}`,
        isAuth: true,
        payload: {
          avatar: file.base64
        }
      });

      if (response.error === false && response.status === 200) {

        setLoading(false);
        resourceContext.setToast({
          ...resourceContext.toast,
          show: true,
          message: `Field picture uploaded successfully`
        });

        setTimeout(() => {
          setFile(null)
          window.location.reload()
        }, 500)

      }

      if (response.error === true) {

        setLoading(false)

        if (response.errors.length > 0) {
          resourceContext.setToast({
            ...resourceContext.toast,
            show: true,
            type: 'error',
            message: response.errors.join(',')
          })
        } else {
          resourceContext.setToast({
            ...resourceContext.toast,
            show: true,
            type: 'error',
            message: response.message
          })
        }

      }

    }

    setTimeout(() => {
      resourceContext.setToast({ ...resourceContext.toast, show: false })
      setPasswordChange({ ...passwordChange, error: '' })
    }, 2500)

  }

  return (
    <>


      <div className="details-header">

        <div className="halve left-halve">

          <div>

            <div className={`avatar rg ui-full-bg bg-center ${loading ? 'disabled-light' : ''}`}>

              <span className="font-hostgro-bold pab-900 fs-20 ui-upcase">{helper.getInitials(`${coreContext.field.name || '-------'}`)}</span>

            </div>

          </div>

          <div className='pdl1 ui-line-height-medium'>

            <div onClick={(e) => { console.log(file?.base64) }} className="mrgb0 font-hostgro-bold fs-20 color-black ui-capitalize mrgb0">
              {
                coreContext.loading ?
                  <Placeholder height='17px' width="160px" radius={'10px'} bgColor='#eceaf1' animate={true} />
                  : <>{`${coreContext.field.name}` || '--------'}</>
              }
            </div>

            <div className="font-hostgro fs-14 pag-500 mrgb0 ui-capitalize d-flex align-items-center">
              {
                coreContext.loading ?
                  <Placeholder height='17px' width="160px" radius={'10px'} bgColor='#eceaf1' animate={true} />
                  :
                  <>
                    <span className='fs-14 font-hostgro'>{coreContext.field.code || '--------'} </span>
                    <Icon
                      type='feather'
                      name='copy'
                      clickable={true}
                      size={15}
                      onClick={(e) => copy(e, coreContext.industry.code)}
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
              <span className='fs-14 color-black-neutral pdr'>Field Name:</span>

              {
                coreContext.loading ?
                  <Placeholder height='17px' width="160px" radius={'10px'} bgColor='#eceaf1' animate={true} />
                  : <span className='font-hostgro fs-14 pag-500'> {coreContext.field.name || '------'} </span>
              }

            </div>
            <div className="mrgb0">
              <span className='font-hostgro fs-14 color-black-neutral pdr'>Label:</span>

              {
                coreContext.loading ?
                  <Placeholder height='17px' width="160px" radius={'10px'} bgColor='#eceaf1' animate={true} />
                  :
                  <span className='font-hostgro fs-14 font-hostgro fs-14 pag-500 ui-capitalize'> {coreContext.field.label || '-------'} </span>
              }

            </div>

          </div>

          <div className='col-xl-4 col-lg-6 col-md-6 col-12  mrgb0 lg-mrgb1-mid md-mrgb1'>
            <div className="mrgb1  lg-mrgb md-mrgb">
              <span className='font-hostgro fs-14 color-black-neutral pdr'>Career:</span>

              {
                coreContext.loading ?
                  <Placeholder height='17px' width="160px" radius={'10px'} bgColor='#eceaf1' animate={true} />
                  : <span className='font-hostgro fs-14 pag-500'> {coreContext.industry?.careers?.length || 0} </span>
              }

            </div>
            <div className="mrgb0 ">
              <span className='font-hostgro fs-14 color-black-neutral pdr'>Code:</span>

              {
                coreContext.loading ?
                  <Placeholder height='17px' width="160px" radius={'10px'} bgColor='#eceaf1' animate={true} />
                  : <span className='font-hostgro fs-14 pag-500'> {coreContext.field.code || '-------'} </span>
              }

            </div>

          </div>

          <div className='col-xl-4 col-lg-6 col-md-6 col-12  mrgb0 lg-mrgb1-mid md-mrgb1'>
            <div className="mrgb1  lg-mrgb md-mrgb">
              <span className='font-hostgro fs-14 color-black-neutral pdr'>Skills:</span>

              {
                coreContext.loading ?
                  <Placeholder height='17px' width="160px" radius={'10px'} bgColor='#eceaf1' animate={true} />
                  : <span className='font-hostgro fs-14 pag-500'> {coreContext.field.name} </span>
              }

            </div>

          </div>

        </div>

      </div>

      <FieldForm
        show={showPanel}
        closeForm={togglePanel}
        type={form.action}
        fieldId={form.fieldId}
        display="details"
        title={form.action === 'add-resource' ? 'Create Industry' : 'Edit Industry'}

      />
    </>

  )
}

export default FieldDetailsPage
