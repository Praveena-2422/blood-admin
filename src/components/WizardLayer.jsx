import React from 'react'
import NumberingWizard from './child/NumberingWizard'
import NumberingWizardWithLabel from './child/NumberingWizardWithLabel'
import OrderByFollowingStep from './child/OrderByFollowingStep'
import WizardWithBesideLabel from './child/WizardWithBesideLabel'

const WizardLayer = () => {
    return (
        <div className="row gy-1">

        

            {/* OrderByFollowingStep */}
            <OrderByFollowingStep />

        </div>

    )
}

export default WizardLayer