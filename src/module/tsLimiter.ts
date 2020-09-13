
import * as TsLimiter from './tsLimiter';

/*----------------------------------------------------------------------------
	%%Function: ITsLimiter
	
    Ths is the interface you will pass around to the limiter. 

    Get one of these by calling CreateLimiter
----------------------------------------------------------------------------*/
export interface ITsLimiter
{
    RemoveTokens: (cTokens: number) => Promise<void>;
};


/*----------------------------------------------------------------------------
	%%Function: TsLimiter
	
    The implementation of our limiter (which just wraps rateLimiter, but has
    a much more convenient promise wrapper)
----------------------------------------------------------------------------*/
class TsLimiter implements ITsLimiter
{
    private m_limiter;

    constructor(nOps: number, msec: number)
    {
        this.m_limiter = new rateLimiter(nOps, msec);
    }

    RemoveTokens = async (cTokens: number): Promise<void> => 
    {
        return new Promise((resolve, reject) => this.m_limiter.removeTokens(1, () => { resolve() }));
    }
};

/*----------------------------------------------------------------------------
	%%Function: CreateLimiter

	Creates a new ITsLimiter interface for us to pass around
----------------------------------------------------------------------------*/
export function CreateLimiter(nOps: number, msec: number): ITsLimiter
{
    return new TsLimiter(nOps, msec);
}
