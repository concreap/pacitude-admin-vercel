import React from 'react'
import helper from '../../../utils/helper.util'
import Divider from '../../../components/partials/Divider'

const Feedback = () => {
    return (
        <>
            <div className="ts-feedback-card">

                <div className="flex items-center justify-between gap-3">
                    <div className='flex items-center gap-3'>

                        <div className={`avatar round sm ui-full-bg bg-center`}
                            style={{ backgroundImage: `url("")` }}>
                            <span className="font-mona-medium pab-900 text-sm uppercase">{helper.getInitials(`Michael Immanuel`)}</span>
                        </div>

                        <div>
                            <h3 className="font-rethink-semibold pag-900 text-[13px]">Michael Immanuel</h3>
                            <p className="font-rethink text-[#717689] text-[11px]">Product Designer</p>
                        </div>

                    </div>

                    <div className='flex items-center gap-x-3'>
                        <span className="font-rethink text-[#717689] text-[13px] leading-relaxed">September 13, 2025 </span>
                        <div className="h-2 w-2 rounded-full bg-pag-300"></div>
                        <span className="font-rethink text-[#717689] text-[13px] leading-relaxed">10:30 AM</span>
                    </div>

                </div>
                <Divider show={false} padding={{ enable: true, top: 'pt-[0.7rem]', bottom: 'pb-[0.7rem]' }} />
                <div>
                    <h3 className="font-rethink-semibold pag-900 text-[13px] leading-relaxed mb-2.5">Figma File:</h3>
                    <p className="font-hostgro text-[#3A3E4F] text-xs leading-relaxed">You clearly defined the goal of the animation and linked it to user experience outcomes. The choice of visual elements and accessibility considerations shows a solid understanding of inclusive design. The sketches helped establish direction before jumping into high-fidelity work, which is excellent practice.</p>
                </div>
                <Divider show={false} padding={{ enable: true, top: 'pt-[0.6rem]', bottom: 'pb-[0.6rem]' }} />
                <div className="bg-[#F2F7FF] min-h-[106px] w-full border-l-5 border-[#4E7DEB] p-4">
                    <h3 className="font-hostgro-semibold text-[#4872C7] text-[13px] leading-relaxed mb-2.5">Areas for Improvement:</h3>
                    <ul className='list-inside list-disc pl-3.5'>
                        <li className='font-hostgro text-[#4872C7] text-xs leading-relaxed mb-1'>Include more detail on how the animation aligns with brand guidelines or overall product style.</li>
                        <li className='font-hostgro text-[#4872C7] text-xs leading-relaxed'>Expand the demographic consideration of your users—different audiences may respond differently to animation styles.</li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Feedback