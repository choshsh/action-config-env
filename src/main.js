const core = require('@actions/core');
const github = require('@actions/github');

export function run() {
    try {
        // input
        const branch = core.getInput('branch');
        const branchProd = core.getInput('branch-prod');

        // variable
        let deployStage = ''
        let imageTag = ''

        // set env
        const eventName = github.context.eventName
        switch (eventName) {
            case 'push':
                deployStage = branch === branchProd ? 'prod' : 'dev'
                imageTag = `${deployStage}-${github.context.sha}`
                break
            case 'pull_request':
                // const headRef = github.context.payload.pull_request.head.ref
                deployStage = 'dev'
                imageTag = `${deployStage}-${github.context.sha}`
                break
        }

        if (!deployStage) throw new Error('Failed to set environment.');

        console.log(`deploy_stage : ${deployStage}`)
        console.log(`image_tag : ${imageTag}`)
        core.setOutput('deploy_stage', deployStage)
        core.setOutput('image_tag', imageTag)
    } catch (error) {
        core.setFailed(error?.message);
    }
}